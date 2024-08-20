import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    create(createEventDto: CreateEventDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEventDto: UpdateEventDto): string;
    remove(id: string): string;
}
