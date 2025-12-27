// Mock for expo-file-system/legacy for testing
export const documentDirectory = "/mock/documents/";

export async function getInfoAsync(path: string) {
  return {
    exists: true,
    uri: path,
    size: 1024,
    isDirectory: path.endsWith("/"),
    modificationTime: Date.now() / 1000,
  };
}

export async function readDirectoryAsync(path: string) {
  return [];
}

export async function makeDirectoryAsync(path: string, options?: any) {
  return;
}

export async function deleteAsync(path: string, options?: any) {
  return;
}

export async function copyAsync(options: { from: string; to: string }) {
  return;
}

export async function moveAsync(options: { from: string; to: string }) {
  return;
}

export async function getFreeDiskStorageAsync() {
  return 10000000000; // 10GB
}

export async function getTotalDiskCapacityAsync() {
  return 50000000000; // 50GB
}
