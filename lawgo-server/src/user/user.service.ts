import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByPhone(phone: string, options?: {
        needPassword?: boolean
    }) {
        const selectFields: (keyof User)[] = ['id', 'username', 'phone', 'createdAt', 'updatedAt', 'deletedAt', 'roles'];

        if (options?.needPassword) {
            selectFields.push('salt', 'passwordHash')
        }

        return this.userRepository.findOne({
            where: {
                phone
            },
            select: selectFields,
        });
    }

    async findByID(id: string, options?: {
        needPassword?: boolean
    }) {
        const selectFields: (keyof User)[] = ['id', 'username', 'phone', 'createdAt', 'updatedAt', 'deletedAt', 'roles'];

        if (options?.needPassword) {
            selectFields.push('salt', 'passwordHash')
        }

        return this.userRepository.findOne({
            where: {
                id
            },
            select: selectFields,
        });
    }

    async create(options: {
        phone: string;
        username?: string;
        salt?: string;
        passwordHash?: string;
        roles?: UserRole[];
    }) {
        const { phone, username, salt, passwordHash, roles } = options;
        const user = this.userRepository.create();
        user.phone = phone;
        username && (user.username = username)
        salt && (user.salt = salt);
        passwordHash && (user.passwordHash = passwordHash);
        roles && (user.roles = roles);
        return this.userRepository.save(user);
    }

    async update(id: string, updateData: Partial<User>) {
        return this.userRepository.update({ id }, updateData);
    }

    comparePassword(user: User, password: string) {
        if (!user.passwordHash || !user.salt) {
            return false;
        }

        return user.passwordHash === this.hashPassword(password, user.salt);
    }

    hashPassword(password: string, salt: string) {
        return createHash('sha256').update(`${password}${salt}`).digest('hex');
    }

    generateSalt() {
        return createHash('md5').update(`${Math.random()}${Date.now()}`).digest('hex');
    }

    async list() {
        return this.userRepository.find({
            select: ['id', 'phone', 'username', 'createdAt', 'updatedAt', 'deletedAt', 'roles'],
            order: {
                createdAt: 'asc',
            }
        });
    }

    async delete(id: string) {
        return this.userRepository.softDelete({ id });
    }

    async count() {
        return this.userRepository.count();
    }
}

