"""empty message

Revision ID: f8937f0e29a0
Revises: 928a41165630
Create Date: 2021-03-10 10:29:30.580752

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f8937f0e29a0'
down_revision = '928a41165630'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('contacts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('name', sa.String(length=40), nullable=True),
    sa.Column('email', sa.String(length=40), nullable=True),
    sa.Column('subject', sa.String(length=200), nullable=True),
    sa.Column('ip', sa.String(length=30), nullable=True),
    sa.Column('message', sa.String(length=1000), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('contacts')
    # ### end Alembic commands ###
