import { Global, Module } from '@nestjs/common';
import { DatabaseExceptionService } from './services/database-exception.service';

@Global()
@Module({
    providers: [DatabaseExceptionService],
    exports: [DatabaseExceptionService],
})
export class CommonModule { }
