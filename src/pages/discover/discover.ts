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

@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})

export class DiscoverPage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<Challenge>;
  stackConfig: StackConfig;

  constructor(private api: ApiProvider) {
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
      this.cards.shift()
      this.swingStack.cards.shift();
      if(this.cards.length < 15){
        this.addNewCards();
      }
      console.log("SwingStack: ", this.swingStack.cards.length);
    });

    this.api.authReady().then(
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
  
  // This method is called by hooking up the event
  // on the HTML element - see the template above
  onThrowOut(event: ThrowEvent) {
    console.log('Target', event.target);
    console.log('Hook from the template', event.throwDirection);
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
