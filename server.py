import http.server
import socketserver
import os
import re
import urllib.parse

PORT = 3000

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                self.send_response(301)
                new_parts = (parts[0], parts[1], parts[2] + '/', parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)

        ctype = self.guess_type(path)
        if path.endswith('.m4a'):
            ctype = 'audio/mp4'
        elif path.endswith('.wav'):
            ctype = 'audio/wav'

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        size = fs[6]

        range_header = self.headers.get('Range')
        if range_header:
            m = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if m:
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else size - 1
                if start >= size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    f.close()
                    return None
                end = min(end, size - 1)
                length = end - start + 1
                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
                self.end_headers()
                f.seek(start)
                self.range_length = length
                return f

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()
        self.range_length = size
        return f

    def copyfile(self, source, outputfile):
        length = getattr(self, 'range_length', None)
        if length is None:
            super().copyfile(source, outputfile)
            return
        bufsize = 64 * 1024
        bytes_left = length
        while bytes_left > 0:
            read_size = min(bytes_left, bufsize)
            buf = source.read(read_size)
            if not buf:
                break
            try:
                outputfile.write(buf)
            except (BrokenPipeError, ConnectionResetError):
                break
            bytes_left -= len(buf)

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), RangeHTTPRequestHandler) as httpd:
        print(f"Serving HTTP with Range Support on port {PORT}...")
        httpd.serve_forever()
