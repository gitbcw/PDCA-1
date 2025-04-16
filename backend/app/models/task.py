import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, TYPE_CHECKING

from pydantic import Field
from sqlmodel import Relationship, SQLModel

if TYPE_CHECKING:
    from app.models import User


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    CANCELLED = "cancelled"


# 共享属性
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    status: TaskStatus = Field(default=TaskStatus.TODO)
    due_date: Optional[datetime] = Field(default=None)


# 用于创建任务的模型
class TaskCreate(TaskBase):
    pass


# 用于更新任务的模型
class TaskUpdate(TaskBase):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None


# 数据库模型
class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: "User" = Relationship(back_populates="tasks")


# 返回给API的模型
class TaskPublic(TaskBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    owner_id: uuid.UUID


class TasksPublic(SQLModel):
    data: List[TaskPublic]
    count: int
