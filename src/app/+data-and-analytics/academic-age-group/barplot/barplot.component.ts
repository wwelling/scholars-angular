import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, PLATFORM_ID } from '@angular/core';

import * as d3 from 'd3';

import { Observable } from 'rxjs';
import { Datum } from '../../../core/store/sdr/sdr.reducer';
import { id } from '../../../shared/utilities/id.utility';

export interface BarplotInput {
  label: string;
  data: Datum[],
}

@Component({
  selector: 'scholars-barplot',
  templateUrl: './barplot.component.html',
  styleUrls: ['./barplot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarplotComponent {

  @Input()
  public height = 586;

  @Input()
  public width = 396;

  @Input()
  public maxOverride: number;

  @Input()
  public lineColor: string;

  @Input()
  public input: Observable<BarplotInput>;

  public id: string;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    this.id = id();
  }

  public draw(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    d3.selectAll('figure > *').remove();

    // set the dimensions and margins of the graph
    const margin = {
      top: 100,
      bottom: 100,
      left: 100,
      right: 50,
    };

    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    let svg, ageGroupScale;

    let index = 0;

    const subscription = this.input.subscribe((input: BarplotInput) => {

      const data = [...input.data].reverse();

      if (index === 0) {
        const max = this.maxOverride ? this.maxOverride : d3.max(data.map((d: any) => d.value));

        // append the svg object to the body of the page
        svg = d3.select(`#${this.id}`)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        // researchers
        const researcherScale = d3.scaleLinear()
          .range([0, width])
          .domain([0, max]);

        // age groups
        ageGroupScale = d3.scaleBand()
          .range([0, height])
          .domain(data.map((d) => d.label))
          .padding(.1);

        // bottom axis
        svg.append('g')
          .attr('transform', `translate(5,${height + 15})`)
          .call(d3.axisBottom(researcherScale).ticks(this.getTicks(max)).tickSize(0))
          .call(g => g.select('.domain').remove())
          .selectAll('text')
          .style('text-anchor', 'end');

        // left axis
        svg.append('g')
          .attr('transform', 'translate(-10,0)')
          .call(d3.axisLeft(ageGroupScale).tickSize(0).tickFormat((d, i) => data[i].label))
          .call(g => g.select('.domain').remove())
          .selectAll('text')
          .style('text-anchor', 'end');

        const bar = svg.selectAll()
          .data(data)
          .enter()
          .append('g');

        bar.append('rect')
          .attr('x', researcherScale(0))
          .attr('y', (d) => ageGroupScale(d.label))
          .attr('width', (d) => researcherScale(d.value))
          .attr('height', ageGroupScale.bandwidth())
          .attr('fill', 'lightgray')
          .style("stroke", "gray")
          .style("stroke-width", "1px");

        bar.append('text')
          .attr('x', (d) => researcherScale(d.value) + 5)
          .attr('y', (d) => ageGroupScale(d.label) + (ageGroupScale.bandwidth() / 2))
          .style('font', '11px')
          .style('font-family', '"Lato", Calibri, Arial, sans-serif')
          .attr('fill', 'gray')
          .text((d) => d.value);

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -(height / 2))
          .attr("y", -margin.left + 10)
          .style("text-anchor", "middle")
          .style('font', '11px')
          .style('font-family', '"Lato", Calibri, Arial, sans-serif')
          .text("Academic age group");

        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height + (margin.top / 2))
          .style("text-anchor", "middle")
          .style('font', '11px')
          .style('font-family', '"Lato", Calibri, Arial, sans-serif')
          .attr('fill', 'gray')
          .text(input.label);

      } else {

        const max = d3.max(data.map((d: any) => d.value));

        // research
        const researchScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, width]);

        // top axis
        svg.append('g')
          .attr('transform', 'translate(5,-10)')
          .call(d3.axisTop(researchScale).ticks(4).tickSize(0))
          .call(g => g.select('.domain').remove())
          .selectAll('text')
          .style('text-anchor', 'end');

        // Add the line
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', this.lineColor)
          .attr('stroke-width', 1.25)
          .attr('d', d3.line()
            .x(function (d, i) {
              return researchScale(data[i].value);
            })
            .y(function (d, i) {
              return ageGroupScale(data[i].label) + (ageGroupScale.bandwidth() / 2);
            }));

        // Add the points
        svg
          .append('g')
          .selectAll('point')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', (d) => {
            return researchScale(d.value);
          })
          .attr('cy', (d) => {
            return ageGroupScale(d.label) + (ageGroupScale.bandwidth() / 2);
          })
          .attr('fill', this.lineColor)
          .attr('stroke', this.lineColor)
          .attr('r', 2);

        svg
          .append('g')
          .selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('x', (d) => researchScale(d.value) - 10)
          .attr('y', (d) => ageGroupScale(d.label))
          .style('font', '11px')
          .style('font-family', '"Lato", Calibri, Arial, sans-serif')
          .attr('fill', this.lineColor)
          .text((d) => d.value);

        svg.append("text")
          .attr("x", width / 2)
          .attr("y", -(margin.top / 3))
          .style("text-anchor", "middle")
          .style('font', '11px')
          .style('font-family', '"Lato", Calibri, Arial, sans-serif')
          .attr('fill', this.lineColor)
          .text(input.label);

        subscription.unsubscribe();
      }

      index++;
    });
  }

  private getTicks = (max: number): number => {
    let interval = Math.pow(10, max.toString().length - 1);

    if (interval >= 10) {
      interval /= 2;
    }

    return max / interval;
  }

}
