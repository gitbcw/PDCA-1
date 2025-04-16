import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import TaskCreate, TaskPublic, TasksPublic, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=TasksPublic)
def read_tasks(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    获取当前用户的所有任务
    """
    tasks = crud.get_tasks(
        session=session, owner_id=current_user.id, skip=skip, limit=limit
    )
    return TasksPublic(data=tasks, count=len(tasks))


@router.post("/", response_model=TaskPublic)
def create_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    task_in: TaskCreate,
) -> Any:
    """
    创建新任务
    """
    task = crud.create_task(
        session=session, task_in=task_in, owner_id=current_user.id
    )
    return task


@router.get("/{task_id}", response_model=TaskPublic)
def read_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    task_id: uuid.UUID,
) -> Any:
    """
    获取指定任务
    """
    task = crud.get_task(session=session, task_id=task_id, owner_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskPublic)
def update_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    task_id: uuid.UUID,
    task_in: TaskUpdate,
) -> Any:
    """
    更新任务
    """
    task = crud.get_task(session=session, task_id=task_id, owner_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task = crud.update_task(session=session, task=task, task_in=task_in)
    return task


@router.delete("/{task_id}", response_model=TaskPublic)
def delete_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    task_id: uuid.UUID,
) -> Any:
    """
    删除任务
    """
    task = crud.get_task(session=session, task_id=task_id, owner_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    crud.delete_task(session=session, task=task)
    return task
