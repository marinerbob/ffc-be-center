import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compare, genSalt, hash } from 'bcrypt'

@Injectable()
export class PasswordService {
	constructor(private readonly configService: ConfigService) {}

	async generatePasswordForUser(password: string): Promise<string> {
		try {
			const genRoundsCount = this.configService.getOrThrow('SALT_GEN_ROUNDS')
			const salt = await genSalt(Number(genRoundsCount))

			return await hash(password, salt)
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
