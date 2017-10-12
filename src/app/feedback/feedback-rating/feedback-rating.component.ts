import { Component, OnInit, ViewContainerRef, AfterViewInit, Input } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'slides-feedback-rating',
  templateUrl: './feedback-rating.component.html',
  styleUrls: ['./feedback-rating.component.css']
})
export class FeedbackRatingComponent implements OnInit, AfterViewInit {

  @Input() showSummary = false;
  @Input() lesson = '';
  ratings$: Observable<any[]>;
  ratingsClass = 'ratings ratingshidden';
  rateSelected = -1;
  rates = [
    {
      src: 'ng-smile.svg',
      value: '"perfect',
      text: 'Perfect!'
    },
    {
      src: 'ng-sad.svg',
      value: 'needmorecontent',
      text: 'Hoped for more'
    },
    {
      src: 'ng-sleepy.svg',
      value: 'boring',
      text: 'Boring'
    },
    {
      src: 'ng-angry.svg',
      value: 'wasteoftime',
      text: 'Waste of time!'
    },
  ];

  constructor(private feedbackService: FeedbackService) {
  }

  ngOnInit() {
    this.ratings$ = this.feedbackService.getRatings();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ratingsClass = 'ratings slideup';
    }, 1000);
  }

  rateClass(option: number) {
    let className = '';
    if (option === this.rateSelected) {
      className = 'rateselected';
    }
    return 'rate ' + className;
  }

  selectRate(option: number) {
    this.rateSelected = option;
    this.ratingsClass = 'ratings slidedown';
    this.feedbackService.addRating(this.lesson, this.rates[option].value);
  }

}
