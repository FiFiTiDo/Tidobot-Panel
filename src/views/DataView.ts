import JsonView from "./JsonView";

export default class DataView extends JsonView {
    constructor(data: any) {
        super({
            total: Array.isArray(data) ? data.length : 1,
            data: Array.isArray(data) ? data : [data]
        });
    }
}