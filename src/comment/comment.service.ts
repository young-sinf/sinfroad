import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { PostService } from '../post/post.service';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private postService: PostService,
  ) {}

  async getComments(postId: string, userId: string, page: number) {}

  async createComment(user: UserEntity, postId: string, contents: string) {
    const post = await this.postService.findById(postId);

    if (!post) {
      throw new BadRequestException();
    }

    const comment = new CommentEntity();
    comment.contents = contents;
    comment.user = user;
    comment.post = post;

    const newComment = await this.commentRepository.save(comment);

    return newComment;
  }

  async deleteComment(user: UserEntity, commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment || comment.user.id !== user.id) {
      throw new BadRequestException();
    }

    await this.commentRepository.remove(comment);
  }
}
