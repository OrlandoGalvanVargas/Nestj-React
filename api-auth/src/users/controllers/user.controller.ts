import { Body, Param, Patch, NotFoundException, BadRequestException, Controller, UseGuards, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../dto/user.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('admin-data')
  @Roles('ADMIN')
  getAdminData() {
    return { secretData: 'Solo admins pueden ver esto' };
  }

  // 🚀 Nueva ruta para cambiar el rol de un usuario
  @Patch(':id/role')
  @Roles('ADMIN')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') newRole: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Validación simple de roles válidos
    const validRoles = ['ADMIN', 'USER', 'LEADER']; // ajusta según tus necesidades
    if (!validRoles.includes(newRole.toUpperCase())) {
      throw new BadRequestException(`Rol inválido. Roles válidos: ${validRoles.join(', ')}`);
    }

user.roles = [newRole.toUpperCase()];
    await this.userRepository.save(user);

    return { message: `Rol del usuario actualizado a ${user.roles}` };
  }
}
