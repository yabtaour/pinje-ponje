import {Injectable} from '@nestjs/common';

@Injectable()
export class GameService {
	getGame() {
		return 'getGame';
	}

	createGame() {
		return 'createGame';
	}

	updateGame() {
		return 'updateGame';
	}
}
