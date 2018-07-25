import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';

import {
  Direction,
  StackConfig,
  Stack,
  Card,
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

  constructor(private api: ApiProvider, private annotatations: AnnotationProvider) {
    this.stackConfig = {
      // Default setting only allows UP, LEFT and RIGHT so you can override this as below
      allowedDirections: [
        Direction.UP,
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
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
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

    this.swingStack.throwout.subscribe((event: ThrowEvent) =>
    {
      let challenge = this.cards.shift()
      this.swingStack.cards.shift();
      if(this.cards.length < 15){
        this.addNewCards();
      }
      this.makeAnnotation(challenge, event.throwDirection)
    });

    setInterval(() => {
      if(this.cards.length == 0){
        this.addNewCards();
      }
    }, 7000);

    //Add cards when providers are ready
    Promise.all([this.api.authReady()]) //TODO: , this.annotatations.ready()
    .then(
      () => this.addNewCards()
    );
  }
    
  addNewCards(){
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

  makeAnnotation(challenge: Challenge, direction: Direction){
    let result: string;
    switch (direction) {
      case Direction.LEFT:
        result = "No";
        break;
      case Direction.UP:
        result = "No Food";
        break;
      case Direction.RIGHT:
        result = "Yes";
        break;
    }
    this.annotatations.postAnnotation(challenge.id,result)
    .then(() => console.log("Made annotation"))
    .catch(() => console.log("Annotation failed"));
  }
  

  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    let hexCode = this.decimalToHex(min, 2);

    if ( y < 0) {
      // Card swipe up
      color = '#ebebeb';
    } else if (x < 0) {
      // Card swipe lef
      color = '#FF' + hexCode + hexCode;
    } else {
      // Card swipe right
      color = '#' + hexCode + 'FF' + hexCode;
    }


    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  voteLike() {
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(1,0)
  }

  voteDislike(){ 
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(-1,0);
  }

  voteNofood(){
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(0,-1);
  }

  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }

}
