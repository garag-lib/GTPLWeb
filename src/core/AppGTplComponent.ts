import { GBus, RoutedMatch } from "../services/GBus.js";
import { GTplComponentBase } from "./GTplComponentBase.js";

export abstract class AppGTplComponent extends GTplComponentBase {

    private routeSubscription?: { off(): void };

    onConstruct() {
        this.routeSubscription?.off();
        this.routeSubscription = GBus.subscribe("urlChanged", ({ state, current, prev }) => this.onRouteChange(state, current, prev), { namespace: "router" });
    }

    onDestroy() {
        this.routeSubscription?.off();
        this.routeSubscription = undefined;
    }

    onRouteChange(state: "new" | "history" | "notfound", current: RoutedMatch, prev: RoutedMatch) {

    }

}
