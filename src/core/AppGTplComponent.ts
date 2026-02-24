import { GBus, RoutedMatch } from "../services/GBus.js";
import { GTplComponentBase } from "./GTplComponentBase.js";

export abstract class AppGTplComponent extends GTplComponentBase {

    onConstruct() {
        GBus.on("urlChanged", ({ state, current, prev }) => this.onRouteChange(state, current, prev), { namespace: "router" });
    }

    onRouteChange(state: "new" | "history" | "notfound", current: RoutedMatch, prev: RoutedMatch) {

    }

}
