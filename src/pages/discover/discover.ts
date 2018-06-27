import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';
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
      allowedDirections: [Direction.UP, Direction.LEFT, Direction.RIGHT],
      // Now need to send offsetX and offsetY with element instead of just offset
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    }

    this.cards = [
      { picture: 'https://cenaswiper.luethi.rocks/images/1675561536149857669.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675263681855723195.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675553610091278380.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675557316270604947.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675557671938068223.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675553610091278380.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675557316270604947.jpg'},
      { picture: 'https://cenaswiper.luethi.rocks/images/1675557671938068223.jpg'}
    ];
  }

  ngAfterViewInit() {
    // ViewChild & ViewChildren are only available
    // in this function

    console.log(this.swingStack); // this is the stack
    console.log(this.swingCards); // this is a list of cards

    // we can get the underlying stack
    // which has methods - createCard, destroyCard, getCard etc
    console.log(this.swingStack.stack);

    // and the cards
    // every card has methods - destroy, throwIn, throwOut etc
    this.swingCards.forEach((c) => console.log(c.getCard()));

    // this is how you can manually hook up to the
    // events instead of providing the event method in the template
    this.swingStack.throwoutleft.subscribe(
      (event: ThrowEvent) => console.log('Manual hook: ', event));

    this.swingStack.dragstart.subscribe((event: DragEvent) => console.log(event));

    this.swingStack.dragmove.subscribe((event: DragEvent) => console.log(event));
  }

  // This method is called by hooking up the event
  // on the HTML element - see the template above
  onThrowOut(event: ThrowEvent) {
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
  voteUp(like: boolean) {
    let removedCard = this.cards.pop();
  
  }

  // Connected through HTML
  voteNofood(){
    alert("NoFood")
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
