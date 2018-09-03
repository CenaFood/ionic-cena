
# ionic-cena

The ionic app for the actual cena App. (Multiplatform)

The app is currently tested on Android only and is based on the [Ionic Framework](https://ionicframework.com/) Version 3.x Documentation on the framework can be found under [Ionic Docs](https://ionicframework.com/docs/)

## Dev-Env

Find the official installation Guide [here](https://ionicframework.com/docs/intro/installation/)

To get started you need an working installation of **NodeJS and NPM**.
Run following commands to setup the dev environment.

```bash
npm install -g ionic cordova
git clone git@github.com:CenaFood/ionic-cena.git
```

### Visual Studio Code

If you decide to work with Visual Studio Code to develop this app consider installing the Plugin [Ionic Extension Pack](https://marketplace.visualstudio.com/items?itemName=loiane.ionic-extension-pack).

## Project structure

The Ionic-framework uses Angular under the hood. The main application can be found inside `./src`. All components of the Angular framework get loaded inside `index.html`. Usually it does not need any changes. The Application starting point can be found inside `./src/app/app.components.ts`.
By defining `rootPage:any = TabsPage;` the Tabs-Page gets loaded. See below for Pages. All of our components have been generated with [ionic generate](https://ionicframework.com/docs/cli/generate/)

```bash
./app           # Entry point of Application
./assets        # Images, fonts, icons used inside of the application
./pages         # Different views and their display logic
./providers     # Injectable services such as Auth and API
./theme         # Global styling and scss variables
```

### Pages
Pages consist of an `.html`-File containing the View look definition. It serves a a template. Inside the `.scss`-File the default styling from ionic can be overwritten. Instancing and the actual component definition is done inside `.ts`-File.

Example about.ts:

```TS
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public auth: AuthProvider, private app: App) {
    // All providers (ionic and your own) that are registered inside app.module.ts can be requested here
  }

  // Private methods are callable from about.html on click event
  private logout(){
    this.auth.logout();
    this.app.getRootNav().setRoot('WelcomePage');
  }
}
```

Pages that are not Lazy-Load enabled have to be registered inside `app.module.ts`. Otherwise there will be needed an `pagename.module.ts`-File containing the Module definition. This has impact on the use of [NavController](https://ionicframework.com/docs/api/navigation/NavController/). Use the name (string) of a lazy loaded page for push(page:string) instead of a component push(page:Page).

### Providers
Providers need to have `@Injectable()` defined to be used as intended. Every provider only gets one instance that will be shared between Views and other Providers. Therefore data and data access that is shared between multiple Views/Providers should be outsourced.

## Run your App
Use `ionic cordova run android --device` to run it on a connected device or `ionic serve` to serve to the browser. Beware: Native plugins such as Geolocation might not work in the browser. Also API calls have to be changed to localhost instead of actual API endpoint because of CORS.

## Deployment

### Android

Consult [official documentation](https://ionicframework.com/docs/intro/deploying/) for best understanding.

**Requirements:**

- Java JDK
- Android Studio
- Updated Android SDK tools, platform and component dependencies. Available through Android Studio’s SDK Manager

Use following script to create a PlayStore ready apk:

```bash
cd $PROJECTLOCATION$/
ionic cordova build android --prod --release
jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore YOUR_RELEASE_KEY.jks $PROJECTLOCATION$/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ALIAS
C:/Android/sdk/build-tools/25.0.3/zipalign -v 4 $PROJECTLOCATION$/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $OUTPUTDIR$/app-release-signed.apk
C:/Android/sdk/build-tools/25.0.3/apksigner.bat verify $OUTPUTDIR$/app-release-signed.apk
```

## Interesting links

[SVG into Font in ionic for custom icons](https://www.joshmorony.com/custom-svg-icons-in-ionic-with-ionicons/)