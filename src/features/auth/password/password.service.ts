import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compare, genSalt, hash } from 'bcrypt'

import { PrismaService } from 'src/common/modules/prisma/prisma.service'

@Injectable()
export class PasswordService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
	) {}

	async createPasswordForUser(password: string): Promise<string> {
		try {
			const genRoundsCount = this.configService.getOrThrow('SALT_GEN_ROUNDS')

			const salt = await genSalt(Number(genRoundsCount))
			const hashPassword = await hash(password, salt)

			const passwordInsertResult = await this.prisma.password.create({
				data: {
					value: hashPassword,
				},
			})

			return passwordInsertResult.id
		} catch (error) {
			throw new Error('Error in password creation process')
		}
	}

	async checkPassword(password: string, userHash: string): Promise<boolean> {
		try {
			return await compare(password, userHash)
		} catch (error) {
			throw new Error('Error in password check process')
		}
	}
}
