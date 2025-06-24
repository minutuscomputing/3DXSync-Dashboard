// import 3ddashboard utils before imports requiring static resources (such as vuetify webfonts)
import { widget, disableDefaultCSS, requirejs, onVisibilityChange } from "@widget-lab/3ddashboard-utils";
import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import MyApp from "@/components/App.vue";


const start = () => {
    disableDefaultCSS(true);

    widget.setTitle("3DXSync-Dashboard");

    createApp(MyApp).use(vuetify).use(createPinia()).mount("my-app");

    requirejs(["DS/PlatformAPI/PlatformAPI"], (/* PlatformAPI */) => {
        // use 3DDashboard APIs
    });

    onVisibilityChange((/* visibility */) => {
        // widget (or fullpage) visibility has changed
        // you can enable/disable periodic data refresh based on visibility
    });
};

/**
 * Entry point for both standalone & 3DDashboard modes
 */
widget.addEvent("onLoad", () => {
    start();
});

widget.addEvent("onRefresh", () => {
    // TODO an application data refresh
    // meaning only refresh dynamic content based on remote data, or after preference changed.
    // we could reload the frame [ window.location.reload() ], but this is not a good practice, since it reset preferences
});
