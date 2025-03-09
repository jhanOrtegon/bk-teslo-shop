import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    RequestTimeoutException,
    ServiceUnavailableException,
    UnauthorizedException,
    ForbiddenException
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Injectable()
export class DatabaseExceptionService {

    handleDBExceptions(error: any, className: string): never {
        const logger = new Logger(className)

        logger.error(`Database Error: ${error.message}`, error.stack);

        if (error.code === '23505') {
            throw new ConflictException('Duplicate entry: ' + error.detail);
        }
        if (error.code === '23503') {
            throw new BadRequestException('Foreign key constraint violation: ' + error.detail);
        }
        if (error.code === '23502') {
            throw new BadRequestException('Column constraint violation: ' + error.detail);
        }
        if (error instanceof EntityNotFoundError) {
            throw new NotFoundException('Entity not found');
        }
        if (error instanceof QueryFailedError) {
            throw new BadRequestException('Invalid query: ' + error.message);
        }
        if (error.code === 'ETIMEDOUT') {
            throw new RequestTimeoutException('Database request timed out');
        }
        if (error.code === 'ECONNREFUSED') {
            throw new ServiceUnavailableException('Database connection refused');
        }
        if (error.code === '28P01') {
            throw new UnauthorizedException('Invalid database credentials');
        }
        if (error.code === '42501') {
            throw new ForbiddenException('Insufficient privileges to perform this action');
        }
        if (error.code === '42601') {
            throw new BadRequestException('Syntax error in SQL statement');
        }
        if (error.code === '22P02') {
            throw new BadRequestException('Invalid input syntax for type');
        }
        if (error.code === '22012') {
            throw new BadRequestException('Division by zero is not allowed');
        }
        if (error.code === '40001') {
            throw new BadRequestException('Transaction was aborted due to serialization failure');
        }

        if (error.status) {
            if (error.status === 404) throw new NotFoundException(error.response?.message || 'Resource not found');
            if (error.status === 400) throw new BadRequestException(error.response?.message || 'Bad request');
            if (error.status === 401) throw new UnauthorizedException(error.response?.message || 'Unauthorized');
            if (error.status === 403) throw new ForbiddenException(error.response?.message || 'Forbidden');
            if (error.status === 408) throw new RequestTimeoutException(error.response?.message || 'Request timeout');
            if (error.status === 503) throw new ServiceUnavailableException(error.response?.message || 'Service unavailable');
        }

        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}
