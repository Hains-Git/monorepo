import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post('team/delete/:id')
  async deleteTeam(@Param('id') id: number) {
    return this.teamService.deleteTeam(Number(id) || 0);
  }

  @Get('team/list')
  async listTeams() {
    return this.teamService.listTeams();
  }

  @Get('team/list_with_includes')
  async listTeamsWithIncludes() {
    return this.teamService.listTeamsWithIncludes();
  }

  @Post('team/:id')
  async createTeam(@Param('id') id: number, @Body() body: any) {
    return this.teamService.createTeam(id, body);
  }
}
