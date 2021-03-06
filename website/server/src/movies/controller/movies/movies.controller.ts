import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from 'src/movies/dtos/CreateMovie.dto';
import { RateMovieDto } from 'src/movies/dtos/RateMovie.dto';
import { Genre } from 'src/movies/entities/Genre.entity';
import { MovieDetails } from 'src/movies/entities/MovieDetails.entity';
import { MoviesService } from 'src/movies/services/movies/movies.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Find all movies' })
  async getMovies(): Promise<MovieDetails[]> {
    return await this.moviesService.getMovies();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('genres/all')
  @ApiResponse({ status: 200, description: 'Find all genres' })
  async getGenres(@Request() req: any): Promise<Genre[]> {
    return await this.moviesService.getGenres(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Find movie by Id' })
  async GetById(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return await this.moviesService.getMovieById(id, req.user);
  }

  @Get('search/all')
  @ApiResponse({ status: 200, description: 'Find movies by Title' })
  async GetByTitle(@Query('title') title: string) {
    return this.moviesService.getMovieByTitle(title);
  }

  @Get('genres/:genre')
  @ApiResponse({ status: 200, description: 'Find movies by genre' })
  async GetByGenre(@Param('genre') genre: string): Promise<MovieDetails[]> {
    return await this.moviesService.getMoviesByGenre(genre);
  }

  @Post('create')
  @ApiResponse({ status: 200, description: 'Create a movie' })
  @UsePipes(ValidationPipe)
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rating')
  async setRatingMovie(
    @Body() rateMovieDto: RateMovieDto,
    @Request() req: any,
  ) {
    const newRating = await this.moviesService.setRatingMovie(
      rateMovieDto,
      req.user,
    );

    if (!newRating) throw new UnauthorizedException();

    return { rating: newRating.rating };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete a movie by id' })
  async deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return await this.moviesService.deleteMovie(id);
  }
}
