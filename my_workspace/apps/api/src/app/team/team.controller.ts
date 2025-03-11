import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post('delete/:id')
  async deleteTeam(@Param('id') id: number) {
    return this.teamService.deleteTeam(id);
  }

  @Get('list')
  async listTeams() {
    return this.teamService.listTeams();
  }

  @Get('list_with_includes')
  async listTeamsWithIncludes() {
    return this.teamService.listTeamsWithIncludes();
  }

  @Post(':id')
  async createTeam(@Param('id') id: number, @Body() body: any) {
    return this.teamService.createTeam(id, body);
  }
}
