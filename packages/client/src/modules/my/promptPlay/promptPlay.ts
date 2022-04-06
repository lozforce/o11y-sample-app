import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { userPayloadSchema } from 'o11y_schema/sf_o11ySample';
import { ComponentUtils } from '../../shared/componentUtils';

export default class PromptPlay extends LightningElement {
    private readonly _instr: Instrumentation;
    private static readonly _randomRecordIdLength = 8;

    aggregatedData: string[];

    @track recordId = PromptPlay.getRandomAlphaNumericString();

    constructor() {
        super();
        this._instr = getInstrumentation('PromptPlay');
        this.aggregatedData = [];

        this._instr.registerForLogPrompt((reason: string) => {
            this._instr.log(userPayloadSchema, { recordIds: this.aggregatedData });
        });
    }

    handlePrompt() {
        ComponentUtils.raiseEvent(this, 'promptrequest');
        this.aggregatedData = [];
    }

    handleTake() {
        this.aggregatedData.push(this.recordId);
        this.recordId = PromptPlay.getRandomAlphaNumericString();
    }

    handleRecordIdChange(event: CustomEvent) {
        this.recordId = event.detail.value;
    }

    handleSkip() {
        this.recordId = PromptPlay.getRandomAlphaNumericString();
    }

    static getRandomAlphaNumericString(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < PromptPlay._randomRecordIdLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
