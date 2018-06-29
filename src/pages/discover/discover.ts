import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
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

  cards: Array<any>;
  stackConfig: StackConfig;

  constructor(private http: Http) {
    this.stackConfig = {
      // Default setting only allows UP, LEFT and RIGHT so you can override this as below
      allowedDirections: [
        Direction.UP,
        Direction.LEFT, 
        Direction.RIGHT
      ],
      // Now need to send offsetX and offsetY with element instead of just offset
      throwOutConfidence: (offsetX: number, offsetY: number, targetElement: HTMLElement) => {
        // you would put ur logic based on offset & targetelement to determine
        // what is your throwout confidence
        const xConfidence = Math.min(Math.abs(offsetX) / targetElement.offsetWidth, 1);
        const yConfidence = Math.min(Math.abs(offsetY) / targetElement.offsetHeight, 1);

        return Math.max(xConfidence, yConfidence);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 400;
      },
    }

  }

  ngAfterViewInit() {
      // Either subscribe in controller or set in HTML
      this.swingStack.throwin.subscribe((event: DragEvent) => {
        event.target.style.background = '#ffffff';
      });

      this.swingStack.throwout.subscribe((event: ThrowEvent) =>
      {
        this.cards.shift()
        this.swingStack.cards.shift();
        console.log("SwingStack: ", this.swingStack.cards.length);
      });

      this.cards = [];
      this.addNewCards();
      // this.cards = [{email: ''}];
      setInterval(() => {this.addNewCards();}, 15000);
  }

  addNewCards(){
    let result = [
      { picture: 'https://cenaswiper.luethi.rocks/images/1675561536149857669.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675263681855723195.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675553610091278380.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675557316270604947.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675557671938068223.jpg'}
    ];
    for (let val of result){    
      this.cards.push({
        picture: val.picture,
        id:  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      })
    }
    console.log(this.cards)
  }
  
  trackByCards(index: number, card: any) {
    return card.id
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

  // Connected through HTML
  voteLike() {
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(1,0)
  }

  // Connected through HTML
  voteDislike(){ 
    let removedCard = this.swingStack.cards[0].getCard();
    removedCard.throwOut(-1,0);
  }

  // Connected through HTML
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
