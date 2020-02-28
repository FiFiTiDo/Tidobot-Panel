import moment, {Moment} from "moment";

export type RawRowData = { [key: string]: string|number };
export default class RowData {
    constructor(private raw: RawRowData) {
    }

    public set(key: string, value: string|number) {
        this.raw[key] = value;
    }

    public setBoolean(key: string, value: boolean) {
        this.set(key, value ? 0 : 1);
    }

    public setStringArray(key: string, value: string[]) {
        this.set(key, value.join(",") || "");
    }

    public setDate(key: string, value: Moment) {
        this.set(key, value.toISOString());
    }

    public get(key: string): string|number {
        return this.raw[key];
    }

    public getString(key: string): string {
        return this.get(key).toString();
    }

    public getInteger(key: string): number {
        let val = this.get(key);
        if (typeof val === "number") return val;
        if (typeof val === "string") return parseInt(val);
    }

    public getFloat(key: string): number {
        let val = this.get(key);
        if (typeof val === "number") return val;
        if (typeof val === "string") return parseFloat(val);
    }

    public getBoolean(key: string): boolean {
        return this.get(key) === 1;
    }

    public getStringArray(key: string): string[] {
        return this.getString(key).split(",");
    }

    public getDate(key: string): Moment {
        return moment(this.getString(key));
    }
}