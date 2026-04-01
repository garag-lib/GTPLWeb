import { RoutedMatch } from "../services/GBus.js";
import { GTplComponentBase } from "./GTplComponentBase.js";
export declare abstract class AppGTplComponent extends GTplComponentBase {
    onConstruct(): void;
    onRouteChange(state: "new" | "history" | "notfound", current: RoutedMatch, prev: RoutedMatch): void;
}
