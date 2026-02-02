"""Add conversation and message tables for Phase III AI Chatbot.

Revision ID: 003_conversation_message
Revises: 002 (Phase II)
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '003_conversation_message'
down_revision: Union[str, None] = None  # Set to previous migration if exists
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create conversation table
    op.create_table(
        'conversation',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('last_activity', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_conversation_user_id', 'conversation', ['user_id'], unique=False)
    op.create_index('idx_conversation_last_activity', 'conversation', ['last_activity'], unique=False)

    # Create message table
    op.create_table(
        'message',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('conversation_id', sa.Uuid(), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('tool_calls', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversation.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_message_conversation_id', 'message', ['conversation_id'], unique=False)
    op.create_index('idx_message_created_at', 'message', ['created_at'], unique=False)


def downgrade() -> None:
    # Drop message table first (has FK to conversation)
    op.drop_index('idx_message_created_at', table_name='message')
    op.drop_index('idx_message_conversation_id', table_name='message')
    op.drop_table('message')

    # Drop conversation table
    op.drop_index('idx_conversation_last_activity', table_name='conversation')
    op.drop_index('idx_conversation_user_id', table_name='conversation')
    op.drop_table('conversation')
