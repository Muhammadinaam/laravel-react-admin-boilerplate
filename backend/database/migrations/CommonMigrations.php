<?php

class CommonMigrations
{
    public static function five($table)
    {
        $table->boolean('status')->default(true)->nullable();
        $table->integer('created_by')->nullable();
        $table->integer('updated_by')->nullable();
        $table->timestamps();
    }

    public static function insertEntityPermissions($group, $singularIdt, $pluralIdt, $singularTitle, $pluralTitle)
    {
        DB::table('perms')
            ->insert([
                [
                    'group' => $group,
                    'idt' => $pluralIdt . '_list',
                    'name' => $pluralTitle . ' List',
                    'parent_idt' => null,
                ],
                [
                    'group' => $group,
                    'idt' => 'add_' . $singularIdt,
                    'name' => 'Add ' . $singularTitle,
                    'parent_idt' => $pluralIdt . '_list',
                ],
                [
                    'group' => $group,
                    'idt' => 'edit_' . $singularIdt,
                    'name' => 'Edit ' . $singularTitle,
                    'parent_idt' => $pluralIdt . '_list',
                ],
                [
                    'group' => $group,
                    'idt' => 'delete_' . $singularIdt,
                    'name' => 'Delete ' . $singularTitle,
                    'parent_idt' => $pluralIdt . '_list',
                ],
            ]);
    }
}