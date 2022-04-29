/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { TreeItemCollapsibleState, TreeItem, window } from "vscode";
import { CICSRegionTree } from "./CICSRegionTree";
import { getResource } from "@zowe/cics-for-zowe-cli";
import * as https from "https";
import { toEscapedCriteriaString } from "../utils/filterUtils";
import { getIconPathInResources } from "../utils/profileUtils";
import { CICSTaskTreeItem } from "./treeItems/CICSTaskTreeItem";

export class CICSTaskTree extends TreeItem {
  children: CICSTaskTreeItem[] = [];
  parentRegion: CICSRegionTree;
  activeFilter: string | undefined = undefined;

  constructor(
    parentRegion: CICSRegionTree,
    public iconPath = getIconPathInResources("folder-closed-dark.svg", "folder-closed-light.svg")
  ) {
    super('Tasks', TreeItemCollapsibleState.Collapsed);
    this.contextValue = `cicstreetask.${this.activeFilter ? 'filtered' : 'unfiltered'}.tasks`;
    this.parentRegion = parentRegion;
  }

  public addProgram(task: CICSTaskTreeItem) {
    this.children.push(task);
  }

  public async loadContents() {
    let defaultCriteria = '*';
    let criteria;
    if (this.activeFilter) {
      criteria = toEscapedCriteriaString(this.activeFilter, 'TASK');
    } else {
      criteria = defaultCriteria;
    }
    this.children = [];
    try {

      https.globalAgent.options.rejectUnauthorized = this.parentRegion.parentSession.session.ISession.rejectUnauthorized;

      const taskResponse = await getResource(this.parentRegion.parentSession.session, {
        name: "CICSTASK",
        regionName: this.parentRegion.getRegionName(),
        cicsPlex: this.parentRegion.parentPlex ? this.parentRegion.parentPlex!.getPlexName() : undefined,
      });
      https.globalAgent.options.rejectUnauthorized = undefined;

      const tasksArray = Array.isArray(taskResponse.response.records.cicstask) ? taskResponse.response.records.cicstask : [taskResponse.response.records.cicstask];
      this.label = `Tasks${this.activeFilter?` (${this.activeFilter}) `: " "}[${tasksArray.length}]`;
      for (const task of tasksArray) {
        const newProgramItem = new CICSTaskTreeItem(task, this.parentRegion);
        this.addProgram(newProgramItem);
      }
      this.iconPath = getIconPathInResources("folder-open-dark.svg", "folder-open-light.svg");
    } catch (error) {
      https.globalAgent.options.rejectUnauthorized = undefined;
      if ((error as any)!.mMessage!.includes('exceeded a resource limit')) {
        window.showErrorMessage(`Resource Limit Exceeded - Set a task filter to narrow search`);
      } else if ((error as any).mMessage!.split(" ").join("").includes('recordcount:0')) {
        window.showInformationMessage(`No tasks found`);
      } else {
        window.showErrorMessage(`Something went wrong when fetching tasks - ${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/(\\n\t|\\n|\\t)/gm," ")}`);
      }
    }
  }

  public clearFilter() {
    this.activeFilter = undefined;
    this.contextValue = `cicstreetask.${this.activeFilter ? 'filtered' : 'unfiltered'}.tasks`;
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }

  public setFilter(newFilter: string) {
    this.activeFilter = newFilter;
    this.contextValue = `cicstreetask.${this.activeFilter ? 'filtered' : 'unfiltered'}.tasks`;
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }

  public getFilter() {
    return this.activeFilter;
  }
}
