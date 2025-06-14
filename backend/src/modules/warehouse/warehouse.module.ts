import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
    controllers: [WarehouseController],
    providers: [WarehouseService],
    exports: [WarehouseService],
})
export class WarehouseModule { } 