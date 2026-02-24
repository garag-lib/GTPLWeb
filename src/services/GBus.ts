import { GMatch } from "../core/GRouter";
import { GEvents } from "../core/GEvents";

export type RoutedMatch = (GMatch & { classRef?: any }) | GMatch | null;

export interface GlobalEvents {
    message: string;
    error: { message: string; code?: number };
    urlChanged: {
        state: "new" | "history" | "notfound";
        current: RoutedMatch;
        prev: RoutedMatch;
    };
    [key: string]: any;
}

export const GBus = new GEvents<GlobalEvents>();