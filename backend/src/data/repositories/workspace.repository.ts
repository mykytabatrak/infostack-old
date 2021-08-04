import { EntityRepository, Repository } from 'typeorm';
import { Workspace } from '../entities/workspace';

@EntityRepository(Workspace)
class WorkspaceRepository extends Repository<Workspace> {
  public findById(id: string): Promise<Workspace> {
    return this.findOne({ id });
  }

  public findByIdWithUsers(id: string): Promise<Workspace> {
    return this.findOne(
      { id },
      {
        relations: [
          'userWorkspaces',
          'userWorkspaces.user',
          'userWorkspaces.user.teams',
        ],
      },
    );
  }
}

export default WorkspaceRepository;