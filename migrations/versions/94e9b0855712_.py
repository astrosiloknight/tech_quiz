"""empty message

Revision ID: 94e9b0855712
Revises: f86f2c198c17
Create Date: 2020-12-06 19:06:49.389038

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '94e9b0855712'
down_revision = 'f86f2c198c17'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('questions', sa.Column('qdescription', sa.String(length=1000), nullable=True))
    op.drop_column('questions', 'description')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('questions', sa.Column('description', sa.VARCHAR(length=200), autoincrement=False, nullable=True))
    op.drop_column('questions', 'qdescription')
    # ### end Alembic commands ###