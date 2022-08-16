import { Type } from 'class-transformer';
import { IsArray,  ValidateNested, } from 'class-validator';

export class CreateEventBatchDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { events: { required: true, type: () => [require("./event.dto").CreateEventDto] } };
    }
}
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateEventDto),
    __metadata("design:type", Array)
], CreateEventBatchDto.prototype, "events", void 0);
