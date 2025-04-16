import { IconButton, Menu } from "@chakra-ui/react"
import { FiMoreVertical } from "react-icons/fi"

import { TaskPublic } from "@/client"
import DeleteTask from "./DeleteTask"
import EditTask from "./EditTask"

interface TaskActionsMenuProps {
  task: TaskPublic
}

export const TaskActionsMenu = ({ task }: TaskActionsMenuProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="More options"
          icon={<FiMoreVertical />}
          variant="ghost"
          size="sm"
        />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item asChild>
          <EditTask
            task={task}
            trigger={<button>编辑</button>}
          />
        </Menu.Item>
        <Menu.Item asChild>
          <DeleteTask
            task={task}
            trigger={<button>删除</button>}
          />
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export default TaskActionsMenu
