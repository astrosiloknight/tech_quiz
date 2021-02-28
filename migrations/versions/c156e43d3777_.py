"""empty message

Revision ID: c156e43d3777
Revises: 5aa455d77ced
Create Date: 2021-02-28 16:36:52.538985

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c156e43d3777'
down_revision = '5aa455d77ced'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('quiz_id', sa.Integer(), nullable=True),
    sa.Column('comments', sa.String(length=500), nullable=True),
    sa.Column('commentator', sa.String(length=30), nullable=True),
    sa.ForeignKeyConstraint(['quiz_id'], ['quizes.id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('deletes')
    op.add_column('quizes', sa.Column('delete_date', sa.DateTime(), nullable=True))
    op.add_column('quizes', sa.Column('delete_ip', sa.String(length=30), nullable=True))
    op.add_column('quizes', sa.Column('deleted', sa.Boolean(), nullable=True))
    op.drop_column('quizes', 'comments')
    op.drop_column('quizes', 'commentator')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('quizes', sa.Column('commentator', sa.VARCHAR(length=30), autoincrement=False, nullable=True))
    op.add_column('quizes', sa.Column('comments', sa.VARCHAR(length=500), autoincrement=False, nullable=True))
    op.drop_column('quizes', 'deleted')
    op.drop_column('quizes', 'delete_ip')
    op.drop_column('quizes', 'delete_date')
    op.create_table('deletes',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('participant', sa.VARCHAR(length=60), autoincrement=False, nullable=True),
    sa.Column('score', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('finished', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('questions', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('answers', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('duration', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('state', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('comments', sa.VARCHAR(length=500), autoincrement=False, nullable=True),
    sa.Column('commentator', sa.VARCHAR(length=30), autoincrement=False, nullable=True),
    sa.Column('terminator', sa.VARCHAR(length=30), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='deletes_pkey')
    )
    op.drop_table('comments')
    # ### end Alembic commands ###
