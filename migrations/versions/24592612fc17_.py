"""empty message

Revision ID: 24592612fc17
Revises: f8937f0e29a0
Create Date: 2021-03-11 13:16:03.127752

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '24592612fc17'
down_revision = 'f8937f0e29a0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('contacts', sa.Column('replied', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('contacts', 'replied')
    # ### end Alembic commands ###
