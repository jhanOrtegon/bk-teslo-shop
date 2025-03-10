import { Global, Module } from '@nestjs/common';
import { DatabaseExceptionService } from './services/database-exception.service';
import { DatabaseTableColumns } from './services/database-table-columns.service';

@Global()
@Module({
    providers: [DatabaseExceptionService, DatabaseTableColumns],
    exports: [DatabaseExceptionService, DatabaseTableColumns],
})
export class CommonModule { }
