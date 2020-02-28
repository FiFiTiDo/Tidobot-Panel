import JsonView from "./JsonView";

export default class ErrorView extends JsonView {
    constructor(error: Error) {
        super({
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}