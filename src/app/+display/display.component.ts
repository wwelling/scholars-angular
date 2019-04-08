import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AppState } from '../core/store';

import { DiscoveryView, DisplayView, DisplayTabView, DisplayTabSectionView } from '../core/model/view';
import { WindowDimensions } from '../core/store/layout/layout.reducer';

import { selectWindowDimensions } from '../core/store/layout';
import { SolrDocument } from '../core/model/discovery';

import { selectResourceById, selectDefaultDiscoveryView } from '../core/store/sdr';

import * as fromSdr from '../core/store/sdr/sdr.actions';

@Component({
    selector: 'scholars-display',
    templateUrl: 'display.component.html',
    styleUrls: ['display.component.scss']
})
export class DisplayComponent implements OnDestroy, OnInit {

    public windowDimensions: Observable<WindowDimensions>;

    public displayView: Observable<DisplayView>;

    public discoveryView: Observable<DiscoveryView>;

    public document: Observable<SolrDocument>;

    private subscriptions: Subscription[];

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {
        this.subscriptions = [];
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    ngOnInit() {
        this.windowDimensions = this.store.pipe(select(selectWindowDimensions));
        this.discoveryView = this.store.pipe(
            select(selectDefaultDiscoveryView),
            filter((view: DiscoveryView) => view !== undefined)
        );
        this.subscriptions.push(this.route.params.subscribe((params: Params) => {
            if (params.collection && params.id) {
                this.store.dispatch(new fromSdr.GetOneResourceAction(params.collection, { id: params.id }));
                this.document = this.store.pipe(
                    select(selectResourceById(params.collection, params.id)),
                    filter((document: SolrDocument) => document !== undefined),
                    tap((document: SolrDocument) => {
                        this.displayView = this.store.pipe(
                            select(selectResourceById('displayViews', document.type[0])),
                            filter((view: DisplayView) => view !== undefined)
                        );
                    })
                );
            }
        }));
    }

    public showMainContent(displayView: DisplayView): boolean {
        return displayView.mainContentTemplate && displayView.mainContentTemplate.length > 0;
    }

    public showLeftScan(displayView: DisplayView): boolean {
        return displayView.leftScanTemplate && displayView.leftScanTemplate.length > 0;
    }

    public showRightScan(displayView: DisplayView): boolean {
        return displayView.rightScanTemplate && displayView.rightScanTemplate.length > 0;
    }

    public getMainContentColSize(displayView: DisplayView): number {
        let colSize = 12;
        if (this.showLeftScan(displayView)) {
            colSize -= 3;
        }
        if (this.showRightScan(displayView)) {
            colSize -= 3;
        }
        return colSize;
    }

    public getLeftScanColSize(displayView: DisplayView): number {
        let colSize = 12;
        if (this.showMainContent(displayView)) {
            colSize -= 6;
        }
        if (this.showRightScan(displayView)) {
            colSize -= 3;
        }
        return colSize;
    }

    public getRightScanColSize(displayView: DisplayView): number {
        let colSize = 12;
        if (this.showLeftScan(displayView)) {
            colSize -= 3;
        }
        if (this.showMainContent(displayView)) {
            colSize -= 6;
        }
        return colSize;
    }

    public getTabsToShow(tabs: DisplayTabView[], document: SolrDocument): DisplayTabView[] {
        return tabs.filter((tab: DisplayTabView) => !tab.hidden && this.getSectionsToShow(tab.sections, document).length > 0);
    }

    public getSectionsToShow(sections: DisplayTabSectionView[], document: SolrDocument): DisplayTabSectionView[] {
        return sections.filter((section: DisplayTabSectionView) => !section.hidden && this.documentHasRequiredFields(section.requiredFields, document));
    }

    public getTabsetType(windowDimensions: WindowDimensions): string {
        return windowDimensions.width > 767 ? 'tabs' : 'pills';
    }

    public getTabOrientation(windowDimensions: WindowDimensions): string {
        return windowDimensions.width > 767 ? 'horizontal' : 'vertical';
    }

    private documentHasRequiredFields(requiredFields: string[], document: SolrDocument): boolean {
        for (const requiredField of requiredFields) {
            if (document[requiredField] === undefined) {
                return false;
            }
        }
        return true;
    }

}
