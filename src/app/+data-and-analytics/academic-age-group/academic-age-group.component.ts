import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, filter, map, tap } from 'rxjs';

import { Individual } from '../../core/model/discovery';
import { Filterable } from '../../core/model/request';
import { SidebarItemType, SidebarMenu } from '../../core/model/sidebar';
import { DataAndAnalyticsView, DisplayView, Facet, OpKey } from '../../core/model/view';
import { DialogService } from '../../core/service/dialog.service';
import { AppState } from '../../core/store';
import { selectResourcesAcademicAge } from '../../core/store/sdr';
import { AcademicAge } from '../../core/store/sdr/sdr.reducer';
import { selectActiveThemeVariant } from '../../core/store/theme';
import { fadeIn } from '../../shared/utilities/animation.utility';
import { getFacetFilterLabel } from '../../shared/utilities/discovery.utility';
import { BarplotComponent, BarplotInput } from './barplot/barplot.component';

import * as fromRouter from '../../core/store/router/router.actions';
import * as fromSdr from '../../core/store/sdr/sdr.actions';
import * as fromSidebar from '../../core/store/sidebar/sidebar.actions';

const academicAgeGroupToBarplotInput = (academicAge: AcademicAge): BarplotInput => {
  return {
    label: academicAge.label,
    data: academicAge.groups
  } as BarplotInput;
}

const rk = 'Researchers';
const pk = 'Publications';
const apk = 'Average publications';

@Component({
  selector: 'scholars-academic-age-group',
  templateUrl: './academic-age-group.component.html',
  styleUrls: ['./academic-age-group.component.scss'],
  animations: [fadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademicAgeGroupComponent implements OnInit, OnChanges {

  @Input()
  public organization: Individual;

  @Input()
  public displayView: DisplayView;

  @Input()
  public dataAndAnalyticsView: DataAndAnalyticsView;

  @Input()
  public filters: any[];

  @Input()
  public defaultId: string;

  @Input()
  public upperLimitInYears = 40;

  @Input()
  public groupingIntervalInYears = 5;

  @Output()
  public labelEvent: EventEmitter<string>;

  @ViewChildren(BarplotComponent)
  private barplots: QueryList<BarplotComponent>;

  // TODO: get from dataAndAnalyticsView
  // public maxOverride: Subject<number>;

  public mean: Subject<number>;

  public median: Subject<number>;

  public academicAge: Observable<BarplotInput>;

  public averagePubRateAcademicAge: Observable<BarplotInput>;

  public primaryThemeColor: Observable<string>;

  private sidebarMenuSections: { [key: string]: { facet: Facet, index: number } };

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private store: Store<AppState>,
    private dialog: DialogService,
  ) {
    this.labelEvent = new EventEmitter<string>();
    // this.maxOverride = new Subject<number>();
    this.mean = new Subject<number>();
    this.median = new Subject<number>();
    this.sidebarMenuSections = {};
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const menu: SidebarMenu = {
      sections: this.dataAndAnalyticsView.facets.map((facet: Facet, index: number) => {
        this.sidebarMenuSections[facet.field] = { facet, index };
        return {
          title: facet.name,
          expandable: facet.expandable,
          collapsible: facet.collapsible,
          collapsed: facet.collapsed,
          useDialog: facet.useDialog,
          action: this.dialog.facetEntriesDialog(facet.name, facet.field, true, 1),
          items: [],
        };
      })
    };

    this.store.dispatch(new fromSidebar.LoadSidebarAction({ menu }));

    this.academicAge = this.store.pipe(
      select(selectResourcesAcademicAge('individual')),
      filter((ra: AcademicAge) => !!ra && (ra.label === rk || ra.label === pk)),
      tap((ra: AcademicAge) => {
        if (ra.label === rk) {
          this.mean.next(ra.mean);
          this.median.next(ra.median);
        }
      }),
      map(academicAgeGroupToBarplotInput)
    );

    this.averagePubRateAcademicAge = this.store.pipe(
      select(selectResourcesAcademicAge('individual')),
      filter((ra: AcademicAge) => !!ra && (ra.label === rk || ra.label === apk)),
      map(academicAgeGroupToBarplotInput)
    );

    this.primaryThemeColor = this.store.pipe(
      select(selectActiveThemeVariant('--primary'))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters } = changes;

    this.store.dispatch(new fromSdr.ClearAcademicAgeAction('individual'));

    setTimeout(() => {
      const additionalFilters = [];

      if (filters) {
        if (filters.previousValue) {
          filters.previousValue.forEach((previousFilter: any) => {
            if (filters.currentValue.indexOf(previousFilter) === -1) {
              const section = this.sidebarMenuSections[previousFilter.field];
              if (section) {
                this.store.dispatch(new fromSidebar.RemoveSectionAction({
                  sectionIndex: section.index,
                  itemLabel: getFacetFilterLabel(section.facet, previousFilter),
                  itemField: previousFilter.field,
                }));
              }
            }
          });
        }

        filters.currentValue.forEach((currentFilter: any) => {
          if (filters.previousValue === undefined || filters.previousValue.indexOf(currentFilter) === -1) {
            const section = this.sidebarMenuSections[currentFilter.field];
            if (section) {
              this.store.dispatch(new fromSidebar.AddSectionItemAction({
                sectionIndex: section.index,
                sectionItem: {
                  type: SidebarItemType.ACTION,
                  label: getFacetFilterLabel(section.facet, currentFilter),
                  selected: true,
                  action: new fromRouter.RemoveFilter({ filter: currentFilter }),
                }
              }));
            }
          }
          additionalFilters.push(currentFilter);
        });

      }

      // if (this.organization.id === this.defaultId) {
      //   this.maxOverride.next(3000);
      // } else {
      //   this.maxOverride.next(undefined);
      // }

      this.barplots.forEach(barplot => barplot.draw());

      if (this.organization.id !== this.defaultId && !!this.organization.name) {

        const actualFilter = {
          field: 'organizations',
          value: this.organization.name,
          opKey: OpKey.EQUALS
        };

        if (additionalFilters.indexOf(actualFilter) === -1) {
          additionalFilters.push(actualFilter);
        }
      }

      this.store.dispatch(
        this.build(rk, false, false, additionalFilters, [
          this.build(pk, true, false, additionalFilters, [
            this.build(apk, true, true, additionalFilters)
          ])
        ])
      );
    });
  }

  private build = (
    label: string,
    accumulateMultivaluedDate: boolean = false,
    averageOverInterval: boolean = false,
    additionalFilters: Filterable[] = [],
    queue: fromSdr.GetAcademicAgeAction[] = []
  ): fromSdr.GetAcademicAgeAction => new fromSdr.GetAcademicAgeAction('individual', {
    label,
    query: {
      expression: 'publicationDates:*'
    },
    filters: [
      ...additionalFilters,
      {
        field: 'class',
        value: 'Person',
        opKey: OpKey.EQUALS
      }
    ],
    dateField: 'publicationDates',
    accumulateMultivaluedDate,
    averageOverInterval,
    upperLimitInYears: this.upperLimitInYears,
    groupingIntervalInYears: this.groupingIntervalInYears,
    queue,
  });

}
