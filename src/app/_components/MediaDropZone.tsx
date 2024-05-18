"use client";

import { CloseButton, Image, SimpleGrid, Text } from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MIME_TYPES,
  type DropzoneProps,
  type FileWithPath,
} from "@mantine/dropzone";
import { useState } from "react";
import { getSignedURL } from "../admin/actions";
import { IconPhoto } from "@tabler/icons-react";

type Props = Omit<DropzoneProps, "onDrop"> & {
  initialFiles?: string[];
  onReturnValue: (value: string[]) => void;
  title?: string;
};

export const MediaDropZone = ({
  initialFiles = [],
  accept = [...IMAGE_MIME_TYPE, MIME_TYPES.mp4],
  onReturnValue,
  title = "Drop media files here",
  ...props
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<string[]>(initialFiles);

  const previews = previewFiles.map((file, index) => {
    const isImage = file.includes("image");
    return (
      <div className="relative aspect-square" key={index}>
        {isImage ? (
          <Image
            src={file}
            className="h-full w-full rounded-lg object-cover"
            alt="Preview"
          />
        ) : (
          <video
            src={file}
            className="h-full w-full rounded-lg object-cover"
            autoPlay
            loop
            muted
          />
        )}

        <CloseButton
          className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-black text-white hover:bg-red-500"
          onClick={() => {
            setPreviewFiles((current) =>
              current.filter((fileItem) => file !== fileItem),
            );
            onReturnValue(previewFiles.filter((fileItem) => file !== fileItem));
          }}
          aria-label="Remove image"
        />
      </div>
    );
  });

  const addFiles = async (newFiles: FileWithPath[]) => {
    if (newFiles[0]) {
      setLoading(true);
      try {
        const signedURLRes = await getSignedURL(newFiles[0].type);
        if (signedURLRes.error !== undefined) {
          throw new Error(signedURLRes.error);
        }

        const url = signedURLRes.signedURL;
        await fetch(url, {
          method: "PUT",
          body: newFiles[0],
        });
        setPreviewFiles((current) => [...current, url?.split("?")?.[0] ?? ""]);
        onReturnValue([...previewFiles, url?.split("?")?.[0] ?? ""]);
      } catch (error) {
        console.error(error);
        return;
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Dropzone
        {...props}
        loading={loading}
        accept={accept}
        onDrop={addFiles}
        multiple={false}
      >
        <div className="flex items-center justify-center gap-2 p-10">
          <IconPhoto size={48} stroke={1.7} className="text-slate-200" />
          <Text ta="center" fz="h3" className="text-slate-300">
            {title}
          </Text>
        </div>
      </Dropzone>

      <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </div>
  );
};
