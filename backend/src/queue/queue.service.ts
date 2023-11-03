import { Injectable, Scope } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Rank } from '@prisma/client';

@Injectable({scope: Scope.DEFAULT})
export class QueueService  {
  private readonly queue: {userId: number, rank: Rank, wr: number}[] = [];
  private readonly queueRank: Rank;

  constructor(rank: Rank) {
    this.queueRank = rank;
  }

  async pushToQueue(player: any) {
    await this.queue.push(player);
  }

  async getopponent(rank: Rank, winRate: number) {
    let opponent = await this.queue.find((element) => element.winRate == winRate);
    return opponent;
  }

  async popFromQueue(element: any) {
    const index = await this.queue.indexOf(element);
    if (index == -1)
      return;
    await this.queue.splice(index, 1);
    await this.queue.shift();
  }

  async getQueue() {
    return this.queue;
  }
}
