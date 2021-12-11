import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './controller/movies/movies.controller';
import { Cast } from './entities/Cast.entity';
import { Genre } from './entities/Genre.entity';
import { Movie } from './entities/Movie.entity';
import { MoviesService } from './services/movies/movies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Cast, Genre])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
