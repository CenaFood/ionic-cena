import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';

import {
  Direction,
  StackConfig,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';
import { AnnotationProvider } from '../../providers/annotation/annotation';

@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})

export class DiscoverPage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<Challenge>;
  stackConfig: StackConfig;
  refreshTimer;

  constructor(private api: ApiProvider, private annotations: AnnotationProvider) {
    this.stackConfig = {
      // Default setting only allows UP, LEFT and RIGHT so you can override this as below
      allowedDirections: [
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT
      ],
      // Now need to send offsetX and offsetY with element instead of just offset
      throwOutConfidence: (offsetX: number, offsetY: number, targetElement: HTMLElement) => {
        let xSensitivity = 3;
        let ySensitivity = 3;
        return Math.min(
          Math.max(
            Math.abs(offsetX) / (targetElement.offsetWidth / xSensitivity),
            Math.abs(offsetY) / (targetElement.offsetHeight / ySensitivity)
          ), 1);
      },
      throwOutDistance: (d) => {
        return 900;
      },
    }
  }

  ngAfterViewInit() {
    this.cards = [];
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });

    this.swingStack.throwout.subscribe((event: ThrowEvent) => {
      let challenge = this.cards.shift()
      this.swingStack.cards.shift();
      if (this.cards.length < 15) {
        this.addNewCards();
      }
      this.makeAnnotation(challenge, event.throwDirection)
    });

    this.swingStack.dragmove.subscribe((event: DragEvent) => this.colorOverlay(event.target, event.throwDirection, event.throwOutConfidence));
    this.swingStack.dragend.subscribe((event: DragEvent) => this.resetOverlay(event.target));

    //Add cards when providers are ready
    Promise.all([this.api.authReady()]) 
      .then(
        () => this.addNewCards()
      );
  }

  ionViewDidEnter() {
    this.refreshTimer = setInterval(() => {
      console.log("Check cardstack has cards.")
      if (this.cards.length == 0) {
        this.addNewCards();
      }
    }, 7000);
  }

  ionViewDidLeave(){
    clearInterval(this.refreshTimer);
  }

  addNewCards() {
    console.log("Adding new cards");

    this.api.ApiGet("/challenges")
      .then((challenges: Challenge[]) => {
        challenges.forEach(c => this.cards.push(c));
      })
      .catch(error => console.log(error))
  }

  trackByCards(index: number, card: Challenge) {
    return card.id;
  }

  makeAnnotation(challenge: Challenge, direction: Direction) {
    let result: string;
    switch (direction) {
      case Direction.LEFT:
        result = "No";
        break;
      case Direction.UP:
      case Direction.DOWN:
        result = "No Food";
        break;
      case Direction.RIGHT:
        result = "Yes";
        break;
    }
    this.annotations.postAnnotation(challenge.id, result)
      .then(() => console.log("Made annotation"))
      .catch(() => console.log("Annotation failed"));
  }

  colorOverlay(target: HTMLElement, direction: Direction, throwOutConfidence: number) {
    let color: string;
    let overlay: HTMLElement;

    if (direction == Direction.INVALID) {
      this.resetOverlay(target);
      return;
    }

    //this is the overlay div
    overlay = target.children[1] as HTMLElement;

    switch (direction) {
      case Direction.LEFT:
        color = "#E61515";
        break;
      case Direction.UP:
      case Direction.DOWN:
        color = "#39C4E7";
        break;
      case Direction.RIGHT:
        color = "#1DC51D";
        break;
    }

    overlay.style.backgroundColor = color;
    overlay.style.opacity = Math.min(throwOutConfidence * 2, 0.7).toString();
  }

  resetOverlay(target: HTMLElement) {
    let overlay: HTMLElement;
    //this is the overlay div
    overlay = target.children[1] as HTMLElement;
    overlay.style.backgroundColor = '#FFFFFF';
    overlay.style.opacity = '0';
  }

  voteLike() {
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(1, 0)
  }

  voteDislike() {
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(-1, 0);
  }

  voteNofood() {
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(0, -1);
  }

}
