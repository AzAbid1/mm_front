import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
    selector: 'app-loading',
    standalone: true,
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
    steps: LoadingStep[] = [
        { id: 0, state: 'waiting', title: 'Preparing' },
        { id: 1, state: 'waiting', title: 'Downloading', filesPreparedMax: 50 },
        { id: 2, state: 'waiting', title: 'Analyzing', filesPreparedMax: 50 },
        { id: 3, state: 'waiting', title: 'Creating' },
        { id: 4, state: 'waiting', title: 'Finalizing' },
    ];
    stepCount = this.steps.length;
    step = 0;
    stepObjects = [...this.steps];
    allStepsDone = false;
    progressFrame: any;

    ngOnInit(): void {
        console.log('LoadingComponent ngOnInit triggered'); // Debug
        this.startLoading();
    }

    ngOnDestroy(): void {
        console.log('LoadingComponent ngOnDestroy triggered'); // Debug
        if (this.progressFrame) {
            clearTimeout(this.progressFrame);
        }
    }

    startLoading(): void {
        console.log('Starting loading animation'); // Debug
        const updateStep = (delay: number = 0) => {
            this.progressFrame = setTimeout(() => {
                this.stepObjects = this.stepObjects.map((item) => {
                    if (item.id !== this.step) return item;

                    const updated = this.updatedItem(item);
                    if (updated.state === 'done') {
                        this.step++;
                        this.allStepsDone = this.step === this.stepCount;
                    }
                    return { ...item, ...updated };
                });

                if (this.step === 1 || this.step === 2) updateStep(50);
                else if (this.step < this.stepCount) updateStep(1500);
            }, delay);
        };
        updateStep();
    }

    updatedItem(item: LoadingStep): LoadingStep {
        const { id, state, start, filesPrepared, filesPreparedMax } = item;
        const updated: LoadingStep = { id, state };

        if (!start) {
            updated.start = new Date();
            updated.state = 'progress';
            if (!filesPreparedMax) return updated;
        }
        if (filesPreparedMax) {
            const prepared = filesPrepared === undefined ? -1 : filesPrepared;
            updated.filesPrepared = Math.min(prepared + 1, filesPreparedMax);
        }
        if (!filesPreparedMax || updated.filesPrepared === filesPreparedMax) {
            updated.finish = new Date();
            updated.state = 'done';
        }
        return updated;
    }

    getDistance(index: number): number {
        let distance = index;
        if (this.allStepsDone) {
            distance -= Math.floor(this.stepCount / 2);
        } else {
            let moveBy = this.step;
            if (index > this.step + 1) {
                moveBy += (index - (this.step + 1)) * (1.5 / 5.25);
            }
            distance -= moveBy;
        }
        return distance;
    }

    getFade(index: number): number {
        return this.allStepsDone ? 0 : Math.abs(index - this.step);
    }

    dateFormatted(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
        }).format(date);
    }
}

interface LoadingStep {
    id: number;
    state: 'waiting' | 'progress' | 'done';
    title?: string;
    start?: Date;
    finish?: Date;
    filesPrepared?: number;
    filesPreparedMax?: number;
}