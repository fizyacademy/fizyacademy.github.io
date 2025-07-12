import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Utility
let folderId = 1;
const createFolder = (name) => ({
  id: folderId++,
  name,
  children: [],
});

const generateUniqueName = (base, existing) => {
  if (!existing.includes(base)) return base;
  let i = 1;
  let name;
  do {
    name = `${base} (${i++})`;
  } while (existing.includes(name));
  return name;
};

// Context Menu
const ContextMenu = ({ x, y, onClose, onRename, onDelete }) => {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [onClose]);

  return (
    <div
      className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow"
      style={{ top: y, left: x }}
    >
      <button onClick={onRename} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Rename</button>
      <button onClick={onDelete} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</button>
    </div>
  );
};

ContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Folder Sidebar Tree
const FolderTree = ({ folders, selectedFolder, setSelectedFolder, onContextMenu, editingFolder, onRenameFolder, depth = 0 }) => {
  return folders.map((folder) => (
    <div key={folder.id} style={{ paddingLeft: `${depth * 16}px` }} onContextMenu={(e) => onContextMenu(e, folder, "folder")}>
      <div
        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
        onClick={() => setSelectedFolder(folder)}
      >
        📁 {editingFolder === folder ? (
          <input
            autoFocus
            defaultValue={folder.name}
            className="ml-1 px-1 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            onBlur={(e) => onRenameFolder(folder, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
          />
        ) : folder.name}
      </div>
      {folder.children?.length > 0 && (
        <FolderTree
          folders={folder.children}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onContextMenu={onContextMenu}
          editingFolder={editingFolder}
          onRenameFolder={onRenameFolder}
          depth={depth + 1}
        />
      )}
    </div>
  ));
};

FolderTree.propTypes = {
  folders: PropTypes.array.isRequired,
  selectedFolder: PropTypes.object,
  setSelectedFolder: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  editingFolder: PropTypes.object,
  onRenameFolder: PropTypes.func.isRequired,
  depth: PropTypes.number,
};

// Top Controls
const TopControls = ({ onUploadVideo, onCreateFolder, selectedFolder }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      onUploadVideo(file.name, fakeUrl);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="space-x-2">
        <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
          + Upload Video
          <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
        </label>
        <button className="bg-gray-300 dark:bg-gray-700 dark:text-white px-3 py-1 rounded" onClick={onCreateFolder}>
          + New Folder
        </button>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        📁 {selectedFolder ? selectedFolder.name : "All Videos"}
      </div>
    </div>
  );
};

TopControls.propTypes = {
  onUploadVideo: PropTypes.func.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
  selectedFolder: PropTypes.object,
};

// Video Grid
// داخل VideoGrid.jsx أو الجزء الخاص به

const VideoGrid = ({
  videos,
//   folders,
  selectedFolder,
  onContextMenu,
  renamingVideo,
  onRenameVideo,
  onFolderClick,
  editingFolder,
  onRenameFolder,
}) => {
  const subFolders = selectedFolder?.children || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {subFolders.map((folder) => (
        <div
          key={folder.id}
          className="aspect-video bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded shadow hover:shadow-lg transition relative"
          onClick={() => onFolderClick(folder)}
          onContextMenu={(e) => onContextMenu(e, folder, "folder")}
        >
          <div className="w-full h-full flex items-center justify-center text-4xl text-yellow-500 mb-15">
            📁
          </div>

          {editingFolder === folder ? (
            <input
              autoFocus
              defaultValue={folder.name}
              className="absolute bottom-2 left-2 right-2 text-center text-sm px-2 py-1 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
              onBlur={(e) => onRenameFolder(folder, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            />
          ) : (
            <div className="absolute bottom-2 left-2 right-2 text-center text-sm text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-black/50 rounded px-2 py-1">
              {folder.name}
            </div>
          )}
        </div>
      ))}

      {videos.map((video, i) => (
        <div
          key={i}
          className="aspect-video bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded shadow hover:shadow-lg transition relative"
          onContextMenu={(e) => onContextMenu(e, video, "video")}
        >
          <video controls className="w-full h-full object-contain rounded mb-15">
            <source src={video.url} type="video/mp4" />
          </video>
          {renamingVideo === video ? (
            <input
              autoFocus
              defaultValue={video.name}
              className="absolute bottom-2 left-2 right-2 text-center text-sm px-2 py-1 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
              onBlur={(e) => onRenameVideo(video, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            />
          ) : (
            <div className="absolute bottom-2 left-2 right-2 text-center text-sm text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-black/50 rounded px-2 py-1">
              {video.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

VideoGrid.propTypes = {
  videos: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  selectedFolder: PropTypes.object,
  onContextMenu: PropTypes.func.isRequired,
  renamingVideo: PropTypes.object,
  onRenameVideo: PropTypes.func.isRequired,
  onFolderClick: PropTypes.func.isRequired,
  editingFolder: PropTypes.object,
  onRenameFolder: PropTypes.func.isRequired,
};


VideoGrid.propTypes = {
  videos: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  selectedFolder: PropTypes.object,
  onContextMenu: PropTypes.func.isRequired,
  renamingVideo: PropTypes.object,
  onRenameVideo: PropTypes.func.isRequired,
  onFolderClick: PropTypes.func.isRequired,
};

// Main Component
export default function VideoManager() {
  const [folders, setFolders] = useState([
    createFolder("Courses"),
    createFolder("Tutorials"),
  ]);
  const [videos, setVideos] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [renamingVideo, setRenamingVideo] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const collectFolderIds = (folder) => {
    let ids = [folder.id];
    folder.children.forEach((child) => {
      ids = ids.concat(collectFolderIds(child));
    });
    return ids;
  };

  const deleteFolderRecursive = (list, folderToDelete) =>
    list
      .filter((f) => f.id !== folderToDelete.id)
      .map((f) => ({
        ...f,
        children: deleteFolderRecursive(f.children, folderToDelete),
      }));

  const addFolderToParent = (list, parentId, newFolder) =>
    list.map((f) => {
      if (f.id === parentId) {
        return { ...f, children: [...f.children, newFolder] };
      }
      return { ...f, children: addFolderToParent(f.children, parentId, newFolder) };
    });

  const handleCreateFolder = () => {
    const allNames = [];
    const collectNames = (list) => {
      list.forEach((f) => {
        allNames.push(f.name);
        if (f.children) collectNames(f.children);
      });
    };
    collectNames(folders);

    const name = generateUniqueName("New Folder", allNames);
    const newFolder = createFolder(name);

    if (!selectedFolder) {
      setFolders([...folders, newFolder]);
    } else {
      setFolders(addFolderToParent(folders, selectedFolder.id, newFolder));
    }

    setEditingFolder(newFolder);
  };

  const handleRenameFolder = (folder, newName) => {
    const rename = (list) =>
      list.map((f) =>
        f.id === folder.id
          ? { ...f, name: newName }
          : { ...f, children: rename(f.children || []) }
      );
    setFolders(rename(folders));
    setEditingFolder(null);
  };

  const handleRenameVideo = (video, newName) => {
    setVideos((prev) => prev.map((v) => (v === video ? { ...v, name: newName } : v)));
    setRenamingVideo(null);
  };

  const handleUploadVideo = (name, url) => {
    const existing = videos.map((v) => v.name);
    const unique = generateUniqueName(name, existing);
    setVideos([...videos, { name: unique, url, folderId: selectedFolder?.id || null }]);
  };

  const openContextMenu = (e, target, type) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, target, type });
  };

  const handleDelete = () => {
    if (contextMenu?.type === "folder") {
      const folder = contextMenu.target;
      const ids = collectFolderIds(folder);
      setFolders(deleteFolderRecursive(folders, folder));
      setVideos((prev) => prev.filter((v) => !ids.includes(v.folderId)));
      if (selectedFolder && ids.includes(selectedFolder.id)) {
        setSelectedFolder(null);
      }
    } else if (contextMenu?.type === "video") {
      setVideos((prev) => prev.filter((v) => v !== contextMenu.target));
    }
    setContextMenu(null);
  };

  const handleRename = () => {
    if (contextMenu?.type === "folder") {
      setEditingFolder(contextMenu.target);
    } else if (contextMenu?.type === "video") {
      setRenamingVideo(contextMenu.target);
    }
    setContextMenu(null);
  };

  const filteredVideos = selectedFolder
    ? videos.filter((v) => v.folderId === selectedFolder.id)
    : videos;

  return (
    <div className="relative flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="w-1/4 bg-gray-100 dark:bg-gray-900 h-full p-4 border-r border-gray-300 dark:border-gray-700 overflow-auto">
        <h2 className="text-lg font-bold mb-4">📂 Folders</h2>
        <div
          onClick={() => setSelectedFolder(null)}
          className="mb-2 cursor-pointer hover:underline text-blue-600 dark:text-blue-400"
        >
          📁 All Videos
        </div>
        <FolderTree
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onContextMenu={openContextMenu}
          editingFolder={editingFolder}
          onRenameFolder={handleRenameFolder}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <TopControls
          onUploadVideo={handleUploadVideo}
          onCreateFolder={handleCreateFolder}
          selectedFolder={selectedFolder}
        />

        <VideoGrid
            videos={filteredVideos}
            folders={folders}
            selectedFolder={selectedFolder}
            onContextMenu={openContextMenu}
            renamingVideo={renamingVideo}
            onRenameVideo={handleRenameVideo}
            onFolderClick={(folder) => setSelectedFolder(folder)}
            editingFolder={editingFolder}
            onRenameFolder={handleRenameFolder}
        />

      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
