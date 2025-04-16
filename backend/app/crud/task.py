import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlmodel import Session, select

from app.models import Task, TaskCreate, TaskUpdate


def create_task(*, session: Session, task_in: TaskCreate, owner_id: uuid.UUID) -> Task:
    """创建新任务"""
    task = Task.model_validate(
        task_in, update={"owner_id": owner_id}
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def get_task(*, session: Session, task_id: uuid.UUID, owner_id: uuid.UUID) -> Optional[Task]:
    """获取指定任务"""
    return session.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()


def get_tasks(
    *, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> List[Task]:
    """获取用户的所有任务"""
    return session.exec(
        select(Task).where(Task.owner_id == owner_id).offset(skip).limit(limit)
    ).all()


def update_task(
    *, session: Session, task: Task, task_in: TaskUpdate
) -> Task:
    """更新任务"""
    update_data = task_in.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        task.sqlmodel_update(update_data)
        session.add(task)
        session.commit()
        session.refresh(task)
    return task


def delete_task(*, session: Session, task: Task) -> None:
    """删除任务"""
    session.delete(task)
    session.commit()
