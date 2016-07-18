/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="snapshot.ts" />

namespace Bridge {

    export class FileInfo {

        private changes: ts.TextChangeRange[];
        private contents: string;
        private open: boolean;
        private path: string;
        
        private projectName: string;

        constructor(contents: string, path: string, projectName: string) {
            this.changes = [];
            this.contents = contents;
            this.open = false;
            this.path = path;
            
            this.projectName = projectName;
        }

        public editContents(offset: number, length: number, text: string): void {
            var prefix = this.contents.substring(0, offset);
            var suffix = this.contents.substring(offset + length);
            var newContents = prefix + text + suffix;
            var span = ts.createTextSpan(offset, length);
            var change = ts.createTextChangeRange(span, text.length);

            this.contents = newContents;

            this.changes.push(change);
        }

        public getOpen(): boolean {
            return this.open;
        }

        public setOpen(open: boolean) {
            this.open = open;
        }

        public getPath() {
            return this.path;
        }

        public getSnapshot() {
            return new ScriptSnapshot(this.changes.slice(0), this.contents, this.changes.length);
        }

        public getVersion() {
            return this.changes.length.toString(10);
        }

        public getProjectName() {
            return this.projectName;
        }

        public updateFile(contents: string) {
            var span = ts.createTextSpan(0, this.contents.length);
            var change = ts.createTextChangeRange(span, contents.length);

            this.contents = contents;

            this.changes.push(change);
        }
    }
}
