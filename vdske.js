class WINDOWAPI {
    constructor(params) {
        this.windows = [];
        this.defaultWidth = 400;
        this.defaultHeight = 300;
        this.resizeHandleSize = 10;
    }

    createWindow(title, width = this.defaultWidth, height = this.defaultHeight, initialX = 0, initialY = 0, draggable = true, resizable = true) {
        const windowElement = document.createElement('div');
        windowElement.className = 'window';
        windowElement.style.width = `${width}px`;
        windowElement.style.height = `${height}px`;
        windowElement.style.position = 'absolute';
        windowElement.style.left = `${initialX}px`;
        windowElement.style.top = `${initialY}px`;
        windowElement.style.border = '1px solid #333';
        windowElement.style.backgroundColor = '#222';
        windowElement.style.color = '#fff';
        windowElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
        windowElement.style.resize = resizable ? 'both' : 'none';
        windowElement.style.overflow = 'auto';
        windowElement.style.fontFamily = 'Arial, sans-serif';
        windowElement.style.zIndex = 1111;

        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';
        titleBar.style.backgroundColor = '#111';
        titleBar.style.fontFamily = 'Arial, sans-serif';
        titleBar.style.fontSize = '14px';
        titleBar.textContent = title;

        windowElement.appendChild(titleBar);

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.color = '#fff';
        closeButton.style.backgroundColor = '#111';
        closeButton.style.right = '0';
        closeButton.style.height = `${titleBar.clientHeight}px`;
        closeButton.style.boxShadow = 'none';
        closeButton.style.border = 'none';
        closeButton.style.outline = 'none';
        closeButton.style.borderRadius = '0';
        closeButton.style.webkitAppearance = 'none';
        closeButton.style.mozAppearance = 'none';
        closeButton.style.appearance = 'none';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(windowElement);
            this.windows = this.windows.filter((win) => win !== windowElement);
        });

        const minButton = document.createElement('button');
        minButton.className = 'min-button';
        minButton.textContent = '--';
        minButton.style.position = 'absolute';
        minButton.style.top = '0';
        minButton.style.color = '#fff';
        minButton.style.backgroundColor = '#111';
        minButton.style.right = `30px`;
        minButton.style.height = `${titleBar.clientHeight}px`;
        minButton.style.boxShadow = 'none';
        minButton.style.border = 'none';
        minButton.style.outline = 'none';
        minButton.style.borderRadius = '0';
        minButton.style.webkitAppearance = 'none';
        minButton.style.mozAppearance = 'none';
        minButton.style.appearance = 'none';
        let isMinimized = false;
        minButton.addEventListener('click', () => {
            if (!isMinimized) {
                windowElement.style.height = `20px`;
                windowElement.querySelector('.content').style.display = 'none';
                windowElement.querySelector('.resize-handle').style.display = 'none';
                isMinimized = true;
            } else {
                windowElement.style.height = `${height}px`;
                windowElement.querySelector('.content').style.display = 'block';
                windowElement.querySelector('.resize-handle').style.display = 'block';
                isMinimized = false;
            }
        });

        titleBar.appendChild(closeButton);
        titleBar.appendChild(minButton);
        const content = document.createElement('div');
        content.className = 'content';
        windowElement.appendChild(content);

        if (draggable) {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.style.width = `${this.resizeHandleSize}px`;
            resizeHandle.style.height = `${this.resizeHandleSize}px`;
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.right = '0';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.cursor = 'se-resize';
            windowElement.appendChild(resizeHandle);

            let isDragging = false;
            let isResizing = false;
            let offset = { x: 0, y: 0 };

            titleBar.addEventListener('mousedown', (e) => {
                isDragging = true;
                offset.x = e.clientX - windowElement.getBoundingClientRect().left;
                offset.y = e.clientY - windowElement.getBoundingClientRect().top;
                this.bringToFront(windowElement);
            });

            resizeHandle.addEventListener('mousedown', (e) => {
                isResizing = true;
                const rect = windowElement.getBoundingClientRect();
                offset.x = e.clientX - rect.right;
                offset.y = e.clientY - rect.bottom;
                this.bringToFront(windowElement);
            });

            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    windowElement.style.left = `${e.clientX - offset.x}px`;
                    windowElement.style.top = `${e.clientY - offset.y}px`;
                } else if (isResizing) {
                    const rect = windowElement.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    windowElement.style.width = `${mouseX + offset.x}px`;
                    windowElement.style.height = `${mouseY + offset.y}px`;
                }
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
                isResizing = false;
            });
        }

        document.body.appendChild(windowElement);
        this.windows.push(windowElement);

        return windowElement;
    }

    bringToFront(windowElement) {
        const currentIndex = this.windows.indexOf(windowElement);
        if (currentIndex !== -1) {
            this.windows.splice(currentIndex, 1);
            this.windows.push(windowElement);
            this.windows.forEach((win, index) => {
                win.style.zIndex = index === this.windows.length - 1 ? 5555 : 1111;
            });
        }
    }
}

window['WINDOW_API'] = new WINDOWAPI();
